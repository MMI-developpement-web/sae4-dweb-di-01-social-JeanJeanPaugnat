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
    #[Route('/me', name: 'profile_me', methods: ['GET'])]
    public function showMyProfile(#[CurrentUser] ?User $user): Response 
    {
        if (!$user) {
            return $this->json(['error' => 'Utilisateur non connecté'], 401);
        }
        return $this->json($user, Response::HTTP_OK, [], ['groups' => 'profile']);
    }    

    #[Route('/{username}', name: 'profile_username', methods: ['GET'])]
    public function show(UserRepository $userRepository, string $username): Response
    {
        $user = $userRepository->findOneBy(['username' => $username]);
        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }   
        return $this->json($user, Response::HTTP_OK, [], ['groups' => 'profile']);
    }


}