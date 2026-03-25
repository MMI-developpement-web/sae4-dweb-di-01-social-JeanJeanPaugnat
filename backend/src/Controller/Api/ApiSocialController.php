<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use App\Service\TokenService;

use App\Entity\User;
use App\Entity\Post;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/social', name: 'social_')]
class ApiSocialController extends AbstractController
{  

    #[Route('/follow/{username}', name: 'toggle_follow', methods: ['POST'])]
    public function toggleFollow(#[CurrentUser] ?User $currentUser, string $username, EntityManagerInterface $em): Response
    {
        // 1. Vérifications de sécurité
        if (!$currentUser) {
            return $this->json(['error' => 'Non connecté'], 401);
        }

        $targetUser = $em->getRepository(User::class)->findOneBy(['username' => $username]);

        if (!$targetUser) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        if ($currentUser === $targetUser) {
            return $this->json(['error' => 'On ne peut pas s\'abonner à soi-même'], 400);
        }

        // 2. Logique de Toggle
        // On vérifie si la relation existe déjà dans la collection ManyToMany
        if ($currentUser->getFollowing()->contains($targetUser)) {
            // Se désabonner
            $currentUser->removeFollowing($targetUser);
            $message = "Désabonné avec succès";
            $isFollowing = false;
        } else {
            // S'abonner
            $currentUser->addFollowing($targetUser);
            $message = "Abonné avec succès";
            $isFollowing = true;
        }

        // 3. Sauvegarde
        $em->flush();

        return $this->json([
            'message' => $message,
            'isFollowing' => $isFollowing,
            'followers_count' => $targetUser->getFollowers()->count()
        ]);
    }

    #[Route('/like/{post}', name: 'toggle_like', methods: ['POST'])]
    public function toggleLike(Post $post, #[CurrentUser] ?User $user, EntityManagerInterface $em): Response
    {
        // 1. Vérifications de sécurité
        if (!$user) {
            return $this->json(['error' => 'Non connecté'], 401);   
        }

        if ($user->getLikes()->contains($post)) {
            $user->removeLike($post);
            $liked = false;
        } else {
            $user->addLike($post);
            $liked = true;
        }

        $em->flush(); // Sauvegarde en base 

        return $this->json([
            'liked' => $liked,
            'count' => $post->getLikedBy()->count() // On renvoie le nouveau total [cite: 313]
        ]);
    }
}