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

    #[Groups('default')]
    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $media = [];

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'likes')]
    private Collection $likedBy;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'replies')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'CASCADE')]
    private ?Post $parent = null;

    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'parent', cascade: ['remove'])]
    private Collection $replies;

    private bool $isLiked = false;

    public function __construct()
    {
        $this->likedBy = new ArrayCollection();
        $this->replies = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): ?string
    {
        if ($this->user && $this->user->getIsBlocked()) {
            return "Ce compte a été bloqué pour non-respect des conditions d’utilisation.";
        }
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

    #[Groups('default')]
    public function getIsLiked(): bool
    {
        return $this->isLiked;
    }

    public function setIsLiked(bool $isLiked): static
    {
        $this->isLiked = $isLiked;

        return $this;
    }

    public function getMedia(): ?array
    {
        return $this->media ?? [];
    }

    public function setMedia(?array $media): static
    {
        $this->media = $media;

        return $this;
    }

    public function getParent(): ?Post
    {
        return $this->parent;
    }

    public function setParent(?Post $parent): static
    {
        $this->parent = $parent;

        return $this;
    }

    public function getReplies(): Collection
    {
        return $this->replies;
    }

    #[Groups('default')]
    public function getRepliesCount(): int
    {
        return $this->replies->count();
    }
}
