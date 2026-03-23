<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use App\Service\TokenService;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\FileUploader;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/profile', name: 'profile_')]
class ApiProfileController extends AbstractController
{  

    #[Route('/{username}', name: 'profile_username', methods: ['GET'])]
    public function show(UserRepository $userRepository, string $username, #[CurrentUser] ?User $currentUser): Response
    {
        

        $user = $userRepository->findOneBy(['username' => $username]);
        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        // Vérifier si l'utilisateur courant suit ce profil
        $isFollowing = false;
        if ($currentUser && $currentUser !== $user) {
            $isFollowing = $currentUser->getFollowing()->contains($user);
        }

        $isMe = ($currentUser === $user);


        return $this->json([ 'user' => $user, 'isFollowing' => $isFollowing, 'isMe' => $isMe ], Response::HTTP_OK, [], ['groups' => 'profile']);
    }


}