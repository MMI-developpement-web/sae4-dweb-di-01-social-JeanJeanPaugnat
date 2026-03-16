<?php

namespace App\Controller\Api;

use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/posts', name: 'api_posts_')]
class ApiPostController
{
    #[Route('/', name: 'index', methods: ['GET'])]
    public function index()
    {        return $this->json([
            'message' => 'Welcome to the API Post index!',
            'path' => 'src/Controller/Api/ApiPostController.php',
        ]);
    }
}