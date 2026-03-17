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
        // 1. Supprimer l'ancien token s'il existe
        if ($oldToken = $user->getAccessToken()) {
            $this->entityManager->remove($oldToken);
        }
        
        // 2. Générer une nouvelle valeur de token
        // bin2hex(random_bytes(32)) est la recommandation du TP
        $rawToken = bin2hex(random_bytes(32)); 

        // 3. Créer la nouvelle entité
        $token = new AccessToken();
        $token->setUser($user);
        $token->setValue($rawToken); 
        // Si vous avez ajouté createdAt, vous pouvez le définir ici
        
        // 4. Persister et flusher
        $this->entityManager->persist($token);
        $this->entityManager->flush();

        return $token;
    }
}