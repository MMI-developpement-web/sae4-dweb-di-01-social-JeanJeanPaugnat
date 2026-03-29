<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class MediaUploadService
{
    public function __construct(
        private SluggerInterface $slugger,
        private string $uploadDir,
    ) {}

    /**
     * Déplace un fichier uploadé dans le dossier public et retourne son nom.
     */
    public function upload(UploadedFile $file): string
    {
        $filename = $this->slugger->slug(
            pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)
        ) . '-' . uniqid() . '.' . $file->guessExtension();

        $file->move($this->uploadDir, $filename);

        return $filename;
    }

    /**
     * Déplace plusieurs fichiers et retourne la liste des noms.
     *
     * @param UploadedFile[] $files
     * @return string[]
     */
    public function uploadMany(array $files): array
    {
        $paths = [];
        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $paths[] = $this->upload($file);
            }
        }
        return $paths;
    }
}
