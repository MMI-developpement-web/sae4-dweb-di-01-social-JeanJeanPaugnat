<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
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

}