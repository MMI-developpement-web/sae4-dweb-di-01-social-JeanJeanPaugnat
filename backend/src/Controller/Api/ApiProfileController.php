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
use App\Dto\UpdateProfilePayload;
use App\Service\ProfileService;
use Symfony\Component\HttpKernel\Exception\HttpException;

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

        $isFollowing = false;
        if ($currentUser && $currentUser !== $user) {
            $isFollowing = $currentUser->getFollowing()->contains($user);
        }

        $isMe = ($currentUser === $user);

        return $this->json([
            'user' => $user,
            'isFollowing' => $isFollowing,
            'isMe' => $isMe,
        ], Response::HTTP_OK, [], ['groups' => ['profile']]);
    }

    #[Route('/{username}/posts', name: 'profile_posts', methods: ['GET'])]
    public function posts(UserRepository $userRepository, string $username, #[CurrentUser] ?User $currentUser, PostRepository $postRepository, Request $request): Response
    {
        $user = $userRepository->findOneBy(['username' => $username]);
        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        $limit = $request->query->getInt('limit', 10);
        $offset = $request->query->getInt('offset', 0);

        $posts = $postRepository->findBy(
            ['user' => $user, 'parent' => null],
            ['date_creation' => 'DESC'],
            $limit,
            $offset
        );

        foreach ($posts as $post) {
            $post->setIsLiked($currentUser ? $post->getLikedBy()->contains($currentUser) : false);
        }

        return $this->json($posts, Response::HTTP_OK, [], ['groups' => ['default']]);
    }

    #[Route('/update', name: 'update', methods: ['POST'])]
    public function update(Request $request, #[CurrentUser] ?User $currentUser, ProfileService $profileService): Response
    {
        if (!$currentUser) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $data = $request->request->all();
        if (empty($data)) {
            return $this->json(['error' => 'No data provided'], Response::HTTP_BAD_REQUEST);
        }

        $avatar = $request->files->get('avatar');
        $banner = $request->files->get('banner');

        $payload = new UpdateProfilePayload();
        $payload->biography = $data['biography'] ?? null;
        $payload->website = $data['website'] ?? null;
        $payload->location = $data['location'] ?? null;
        if ($avatar) {
            $payload->setAvatar($avatar);
        }
        if ($banner) {
            $payload->setBanner($banner);
        }

        $profileService->update($currentUser, $payload);

        return $this->json(['message' => 'Profile updated successfully'], Response::HTTP_OK);
    }
}
