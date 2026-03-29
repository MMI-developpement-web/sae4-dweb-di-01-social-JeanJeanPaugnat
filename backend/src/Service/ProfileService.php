<?php

namespace App\Service;

use App\Dto\UpdateProfilePayload;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;

class ProfileService
{
    public function __construct(
        private EntityManagerInterface $em,
        private SluggerInterface $slugger,
        private string $uploadDir,
    ) {}

    public function update(User $user, UpdateProfilePayload $payload): void
    {
        if ($payload->biography !== null) {
            $user->setBiography($payload->biography);
        }
        if ($payload->website !== null) {
            $user->setWebsite($payload->website);
        }
        if ($payload->location !== null) {
            $user->setLocation($payload->location);
        }

        if ($payload->getAvatar()) {
            $user->setAvatar($this->moveFile($payload->getAvatar()));
        }

        if ($payload->getBanner()) {
            $user->setBanner($this->moveFile($payload->getBanner()));
        }

        $this->em->persist($user);
        $this->em->flush();
    }

    private function moveFile(\Symfony\Component\HttpFoundation\File\UploadedFile $file): string
    {
        $filename = $this->slugger->slug(
            pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)
        ) . '-' . uniqid() . '.' . $file->guessExtension();

        $file->move($this->uploadDir, $filename);

        return $filename;
    }
}
