<?php

// src/Controller/ApiLoginController.php
namespace App\Controller\Api;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use App\Service\TokenService;

class ApiLoginController extends AbstractController
{
    #[Route('/login', name: 'login', methods: ['POST'], format: 'json')]
    public function login(
        #[CurrentUser()] User $user,
        TokenService $tokenService,
    ): Response
    {

        if (null === $user) {
            // Si l'utilisateur n'est pas authentifié, on retourne une erreur 401
            return $this->json(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        // Si on arrive ici, c'est que l'authentification a réussi (grâce à json_login dans security.yaml)
        // $user est automatiquement injecté grâce à #[CurrentUser()]
        
        // Vous pouvez maintenant générer un token d'accès pour cet utilisateur et le retourner dans la réponse
        $token = $tokenService->createNewToken($user); // Supposons que votre entité User a une relation avec AccessToken
        
        return $this->json([
            'access_token' => $token->getValue(),
            'user_id' => $user->getId(),
            'email' => $user->getEmail(),
        ]);
    }
}