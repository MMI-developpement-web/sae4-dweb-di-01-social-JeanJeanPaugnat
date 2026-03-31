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

        // Empêcher de follow si l'utilisateur cible nous a bloqué
        if ($targetUser->getBlockedUsers()->contains($currentUser)) {
            return $this->json(['error' => 'Action non autorisée'], 403);
        }

        // Empêcher de follow si on a bloqué l'utilisateur cible
        if ($currentUser->getBlockedUsers()->contains($targetUser)) {
            return $this->json(['error' => 'Vous ne pouvez pas vous abonner à un utilisateur que vous avez bloqué'], 403);
        }

        if ($currentUser->getFollowing()->contains($targetUser)) {
            $currentUser->removeFollowing($targetUser);
            $message = "Désabonné avec succès";
            $isFollowing = false;
        } else {
            $currentUser->addFollowing($targetUser);
            $message = "Abonné avec succès";
            $isFollowing = true;
        }

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
        if (!$user) {
            return $this->json(['error' => 'Non connecté'], 401);
        }

        // Empêcher de liker si le propriétaire du post nous a bloqué
        if ($post->getUser()->getBlockedUsers()->contains($user)) {
            return $this->json(['error' => 'Action non autorisée'], 403);
        }

        if ($user->getLikes()->contains($post)) {
            $user->removeLike($post);
            $liked = false;
        } else {
            $user->addLike($post);
            $liked = true;
        }

        $em->flush();

        return $this->json([
            'is_liked' => $liked,
            'likes_count' => $post->getLikedBy()->count()
        ]);
    }

    #[Route('/block/{username}', name: 'toggle_block', methods: ['POST'])]
    public function toggleBlock(#[CurrentUser] ?User $currentUser, string $username, EntityManagerInterface $em): Response
    {
        if (!$currentUser) {
            return $this->json(['error' => 'Non connecté'], 401);
        }

        $targetUser = $em->getRepository(User::class)->findOneBy(['username' => $username]);

        if (!$targetUser) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        if ($currentUser === $targetUser) {
            return $this->json(['error' => 'On ne peut pas se bloquer soi-même'], 400);
        }

        if ($currentUser->getBlockedUsers()->contains($targetUser)) {
            // Débloquer
            $currentUser->removeBlockedUser($targetUser);
            $isBlocked = false;
            $message = "Utilisateur débloqué";
        } else {
            // Bloquer + auto-unfollow dans les deux sens
            $currentUser->addBlockedUser($targetUser);
            if ($currentUser->getFollowing()->contains($targetUser)) {
                $currentUser->removeFollowing($targetUser);
            }
            if ($targetUser->getFollowing()->contains($currentUser)) {
                $targetUser->removeFollowing($currentUser);
            }
            $isBlocked = true;
            $message = "Utilisateur bloqué";
        }

        $em->flush();

        return $this->json([
            'isBlocked' => $isBlocked,
            'message' => $message,
        ]);
    }
}