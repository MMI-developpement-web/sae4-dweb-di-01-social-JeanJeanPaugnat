<?php

namespace App\Entity;

use App\Repository\PostRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Entity\User;

#[ORM\Entity(repositoryClass: PostRepository::class)]
class Post
{
    #[Groups('default')]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups('default')]
    #[ORM\Column(type: Types::TEXT)]
    
    private ?string $content = null;

    #[Groups('default')]
    #[ORM\Column]
    private ?\DateTime $date_creation = null;

    #[Groups('default')]
    #[ORM\ManyToOne(inversedBy: 'posts')]
    private ?User $user = null;


    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'likes')]
    private Collection $likedBy;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getDateCreation(): ?\DateTime
    {
        return $this->date_creation;
    }

    public function setDateCreation(\DateTime $date_creation): static
    {
        $this->date_creation = $date_creation;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getLikedBy(): Collection
    {
        return $this->likedBy;
    }

    #[Groups('default')]
    public function getLikesCount(): int
    {
        return $this->likedBy->count();
    }
}
