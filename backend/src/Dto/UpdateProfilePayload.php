<?php

namespace App\Dto;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;

class UpdateProfilePayload
{
    #[Assert\Length(max: 160)]
    public ?string $biography = null;

    #[Assert\Length(max: 255)]
    #[Assert\Url]
    public ?string $website = null;

    #[Assert\Length(max: 100)]
    public ?string $location = null;

    #[Assert\File(extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'])]
    private ?UploadedFile $avatar = null;

    #[Assert\File(extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'])]
    private ?UploadedFile $banner = null;

    public function getAvatar(): ?UploadedFile
    {
        return $this->avatar;
    }

    public function setAvatar(?UploadedFile $avatar): self
    {
        $this->avatar = $avatar;
        return $this;
    }

    public function getBanner(): ?UploadedFile
    {
        return $this->banner;
    }

    public function setBanner(?UploadedFile $banner): self
    {
        $this->banner = $banner;
        return $this;
    }
}
