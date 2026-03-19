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


class ApiPostController extends AbstractController
{
    #[Route('/post', name: 'post_')]
    public function home(PostRepository $postRepository): Response
    {
        $post = $postRepository->findAll();
        // dump($post);

        return $this->json($post, Response::HTTP_OK, [], ['groups' => 'default']);
    }
    //route pour créer un post
    #[Route('/post/create', name: 'post_create', methods: ['POST'])]
    public function createPost(PostRepository $postRepository, #[CurrentUser] ?\App\Entity\User $user, Request $request): Response
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

}