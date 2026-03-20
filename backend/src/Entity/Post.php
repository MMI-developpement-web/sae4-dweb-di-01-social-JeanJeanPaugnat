<?php

namespace App\Entity;

use App\Repository\PostRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

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
    
    private ?string $Content = null;

    #[Groups('default')]
    #[ORM\Column]
    private ?\DateTime $Date_creation = null;

    #[Groups('default')]
    #[ORM\ManyToOne(inversedBy: 'posts')]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): ?string
    {
        return $this->Content;
    }

    public function setContent(string $Content): static
    {
        $this->Content = $Content;

        return $this;
    }

    public function getDateCreation(): ?\DateTime
    {
        return $this->Date_creation;
    }

    public function setDateCreation(\DateTime $Date_creation): static
    {
        $this->Date_creation = $Date_creation;

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
}
