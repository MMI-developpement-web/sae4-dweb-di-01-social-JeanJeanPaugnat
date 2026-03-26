<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use App\Service\TokenService;

use App\Entity\User;
use App\Repository\PostRepository;
use App\Repository\UserRepository;
use App\Service\FileUploader;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/profile', name: 'profile_')]
class ApiProfileController extends AbstractController
{  

    #[Route('/{username}', name: 'profile_username', methods: ['GET'])]
    public function show(UserRepository $userRepository, string $username, #[CurrentUser] ?User $currentUser, PostRepository $postRepository, Request $request): Response
    {
        

        $user = $userRepository->findOneBy(['username' => $username]);
        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }
        
        // On récupère les paramètres de pagination depuis l'URL (ex: ?limit=10&offset=0)
        $limit = $request->query->getInt('limit', 10);
        $offset = $request->query->getInt('offset', 0);

        $posts = $postRepository->findBy(
            ['user' => $user], 
            ['date_creation' => 'DESC'],
            $limit,
            $offset
        );

        foreach ($posts as $post) {
            $post->setIsLiked($currentUser ? $post->getLikedBy()->contains($currentUser) : false);
        }

        // Vérifier si l'utilisateur courant suit ce profil
        $isFollowing = false;
        if ($currentUser && $currentUser !== $user) {
            $isFollowing = $currentUser->getFollowing()->contains($user);
        }

        $isMe = ($currentUser === $user);


        return $this->json([ 'user' => $user, 'posts' => $posts, 'isFollowing' => $isFollowing, 'isMe' => $isMe ], Response::HTTP_OK, [], ['groups' => ['profile', 'default']]);
    }


}