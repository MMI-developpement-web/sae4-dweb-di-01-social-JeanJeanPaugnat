<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use App\Service\TokenService;
use App\Entity\Post;
use App\Repository\PostRepository;
use App\Entity\User;


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

        $posts = $postRepository->findBy([], ['date_creation' => 'DESC'], $limit, $offset);

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
    public function createPost(PostRepository $postRepository, #[CurrentUser] User $user, Request $request): Response
    {
        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['content'])) {
            return $this->json(['error' => 'Missing content'], Response::HTTP_BAD_REQUEST);
        }

        $post = new Post();
        $post->setContent($data['content']);
        $post->setDateCreation(new \DateTime());
        $post->setUser($user);
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

}