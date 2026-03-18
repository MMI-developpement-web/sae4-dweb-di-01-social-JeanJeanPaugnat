<?php

// src/Service/TokenService.php
namespace App\Service;
// ... (imports : EntityManagerInterface, User, AccessToken)
use App\Entity\AccessToken;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class TokenService
{
    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    public function createNewToken(User $user): AccessToken
    {
        // Générer une nouvelle valeur de token
        $rawToken = bin2hex(random_bytes(32)); 

        // 1. Récupérer l'ancien token s'il existe
        $token = $user->getAccessToken();
        
        if (!$token) {
            // 2. Créer une nouvelle entité si elle n'existe pas
            $token = new AccessToken();
            $token->setUser($user);
            $this->entityManager->persist($token);
        }

        // 3. Mettre à jour la valeur du token
        $token->setValue($rawToken); 
        
        // 4. Flusher
        $this->entityManager->flush();

        return $token;
    }
}