<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use App\Entity\Post;
use App\Repository\PostRepository;
use App\Entity\User;
use App\Service\MediaUploadService;


class ApiPostController extends AbstractController
{
    #[Route('/posts', name: 'posts_all', methods: ['GET'])]
    public function home(PostRepository $postRepository, #[CurrentUser] User $user, Request $request): Response
    {
        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $limit = $request->query->get('limit', 10);
        $offset = $request->query->get('offset', 0);

        $posts = $postRepository->findBy(['parent' => null], ['date_creation' => 'DESC'], $limit, $offset);

        foreach ($posts as $post) {
            if ($user && $post->getLikedBy()->contains($user)) {
            $post->setIsLiked(true); // On active le flag pour le JSON
        } else {
            $post->setIsLiked(false);
        }
        }

        return $this->json($posts, Response::HTTP_OK, [], ['groups' => 'default']);
    }
    
    //route pour créer un post
    #[Route('/post/create', name: 'post_create', methods: ['POST'])]
    public function createPost(PostRepository $postRepository, #[CurrentUser] User $user, Request $request, MediaUploadService $mediaUpload): Response
    {
        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        // Supporte multipart/form-data (avec fichiers) et application/json (sans)
        if (str_contains($request->headers->get('Content-Type', ''), 'multipart/form-data')) {
            $content = $request->request->get('content', '');
        } else {
            $data = json_decode($request->getContent(), true);
            $content = $data['content'] ?? '';
        }

        $files = $request->files->get('media', []);
        if (!is_array($files)) {
            $files = [$files];
        }

        if ($content === '' && empty($files)) {
            return $this->json(['error' => 'Missing content'], Response::HTTP_BAD_REQUEST);
        }

        $post = new Post();
        $post->setContent($content);
        $post->setDateCreation(new \DateTime());
        $post->setUser($user);

        $mediaPaths = $mediaUpload->uploadMany($files);
        if (!empty($mediaPaths)) {
            $post->setMedia($mediaPaths);
        }

        $postRepository->save($post, true);

        return $this->json($post, Response::HTTP_CREATED, [], ['groups' => 'default']);
    }

    #[Route('/post/following', name: 'following', methods: ['GET'])]
    public function following(PostRepository $postRepository, #[CurrentUser] User $user, Request $request): Response
    {
        $limit = $request->query->get('limit', 10);
        $offset = $request->query->get('offset', 0);

        $posts = $postRepository->findTimeline($user, $limit, $offset);

        return $this->json($posts, Response::HTTP_OK, [], ['groups' => 'default']);
    }

    #[Route('/post/delete/{id}', name: 'post_delete', methods: ['DELETE'])]
    public function deletePost(PostRepository $postRepository, #[CurrentUser] User $user, int $id): Response
    {
        $post = $postRepository->find($id);
        if (!$post) {
            return $this->json(['error' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }

        if ($post->getUser() !== $user) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $postRepository->remove($post, true);

        return $this->json(['message' => 'Post deleted successfully'], Response::HTTP_OK);
    }

    #[Route('/post/{id}', name: 'post_get', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getPost(PostRepository $postRepository, #[CurrentUser] User $user, int $id): Response
    {
        $post = $postRepository->find($id);
        if (!$post) {
            return $this->json(['error' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }

        if ($post->getLikedBy()->contains($user)) {
            $post->setIsLiked(true);
        } else {
            $post->setIsLiked(false);
        }

        return $this->json($post, Response::HTTP_OK, [], ['groups' => 'default']);
    }

    #[Route('/post/edit/{id}', name: 'post_edit', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function editPost(PostRepository $postRepository, #[CurrentUser] User $user, Request $request, MediaUploadService $mediaUpload, int $id): Response
    {
        $post = $postRepository->find($id);
        if (!$post) {
            return $this->json(['error' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }

        if ($post->getUser() !== $user) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $content = $request->request->get('content', $post->getContent());
        $keepMedia = $request->request->all('keepMedia') ?? [];

        $newFiles = $request->files->get('media', []);
        if (!is_array($newFiles)) {
            $newFiles = [$newFiles];
        }

        $post->setContent($content);

        $newPaths = $mediaUpload->uploadMany($newFiles);
        $finalMedia = array_merge($keepMedia, $newPaths);
        $post->setMedia($finalMedia ?: null);

        $postRepository->save($post, true);

        return $this->json($post, Response::HTTP_OK, [], ['groups' => 'default']);
    }

    #[Route('/post/{id}/reply', name: 'post_reply_create', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function createReply(PostRepository $postRepository, #[CurrentUser] User $user, Request $request, int $id): Response
    {
        $parent = $postRepository->find($id);
        if (!$parent) {
            return $this->json(['error' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }

        // Empêcher de répondre si le propriétaire du post nous a bloqué
        if ($parent->getUser()->getBlockedUsers()->contains($user)) {
            return $this->json(['error' => 'Action non autorisée'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);
        $content = $data['content'] ?? '';

        if (trim($content) === '') {
            return $this->json(['error' => 'Content cannot be empty'], Response::HTTP_BAD_REQUEST);
        }

        $reply = new Post();
        $reply->setContent($content);
        $reply->setDateCreation(new \DateTime());
        $reply->setUser($user);
        $reply->setParent($parent);

        $postRepository->save($reply, true);

        return $this->json($reply, Response::HTTP_CREATED, [], ['groups' => 'default']);
    }

    #[Route('/post/{id}/replies', name: 'post_replies_get', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getReplies(PostRepository $postRepository, #[CurrentUser] User $user, int $id): Response
    {
        $parent = $postRepository->find($id);
        if (!$parent) {
            return $this->json(['error' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }

        $replies = $postRepository->findBy(['parent' => $parent], ['date_creation' => 'DESC']);

        foreach ($replies as $reply) {
            $reply->setIsLiked($reply->getLikedBy()->contains($user));
        }

        return $this->json($replies, Response::HTTP_OK, [], ['groups' => 'default']);
    }

    #[Route('/post/{id}/retweet', name: 'post_retweet', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function retweetPost(PostRepository $postRepository, #[CurrentUser] User $user, Request $request, int $id): Response
    {
        $original = $postRepository->find($id);
        if (!$original) {
            return $this->json(['error' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }

        if ($original->getIsCensored()) {
            return $this->json(['error' => 'Cannot retweet a censored post'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);
        $comment = isset($data['comment']) ? trim($data['comment']) : null;

        $retweet = new Post();
        $retweet->setContent($original->getRawContent() ?? '');
        $retweet->setMedia($original->getMedia());
        $retweet->setDateCreation(new \DateTime());
        $retweet->setUser($user);
        $retweet->setIsRetweet(true);
        $retweet->setRetweetAuthor($original->getUser()?->getUsername());
        if ($comment !== null && $comment !== '') {
            $retweet->setRetweetComment($comment);
        }

        $original->setRetweetsCount($original->getRetweetsCount() + 1);

        $postRepository->save($retweet, false);
        $postRepository->save($original, true);

        return $this->json($retweet, Response::HTTP_CREATED, [], ['groups' => 'default']);
    }

}