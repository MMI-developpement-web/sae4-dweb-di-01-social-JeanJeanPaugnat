<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 20)]
    #[Groups(['default', 'profile'])]
    private ?string $username = null;

    #[ORM\Column(length: 180)]
    #[Groups(['default', 'profile'])]
    private ?string $email = null;

    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist', 'remove'])]
    private ?AccessToken $accessToken = null;



    /**
     * @var Collection<int, Post>
     */
    #[ORM\OneToMany(targetEntity: Post::class, mappedBy: 'user')]
    private Collection $posts;
    
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups('profile')]
    private ?string $biography = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups('profile')]
    private ?string $location = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups('profile')]
    private ?string $website = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups('profile')]
    private ?string $avatar = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups('profile')]
    private ?string $banner = null;

    #[ORM\ManyToMany(targetEntity: self::class, inversedBy: 'followers')]
    #[ORM\JoinTable(name: 'subscriptions')]
    private Collection $following;

    #[ORM\ManyToMany(targetEntity: self::class, mappedBy: 'following')]
    private Collection $followers;

    public function __construct()
    {
        $this->posts = new ArrayCollection();
        $this->following = new ArrayCollection();
        $this->followers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

        /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }
    /**
     * Removes sensitive data from the user.
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getAccessToken(): ?AccessToken
    {
        return $this->accessToken;
    }

    public function setAccessToken(AccessToken $accessToken): static
    {
        // set the owning side of the relation if necessary
        if ($accessToken->getUser() !== $this) {
            $accessToken->setUser($this);
        }

        $this->accessToken = $accessToken;

        return $this;
    }

    /**
     * @return Collection<int, Post>
     */
    public function getPosts(): Collection
    {
        return $this->posts;
    }

    public function addPost(Post $post): static
    {
        if (!$this->posts->contains($post)) {
            $this->posts->add($post);
            $post->setUser($this);
        }

        return $this;
    }

    public function removePost(Post $post): static
    {
        if ($this->posts->removeElement($post)) {
            // set the owning side to null (unless already changed)
            if ($post->getUser() === $this) {
                $post->setUser(null);
            }
        }

        return $this;
    }

    public function getBiography(): ?string
    {
        return $this->biography;
    }

    public function setBiography(?string $biography): static
    {
        $this->biography = $biography;

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function getWebsite(): ?string
    {
        return $this->website;
    }

    public function setWebsite(?string $website): static
    {
        $this->website = $website;

        return $this;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(?string $avatar): static
    {
        $this->avatar = $avatar;

        return $this;
    }

    public function getBanner(): ?string
    {
        return $this->banner;
    }

    public function setBanner(?string $banner): static
    {
        $this->banner = $banner;

        return $this;
    }

    public function getFollowing(): Collection
    {
        return $this->following;
    }

    public function getFollowers(): Collection
    {
        return $this->followers;
    }
    
    public function setFollowing(Collection $following): static
    {
        $this->following = $following;

        return $this;
    }

    public function setFollowers(Collection $followers): static
    {
        $this->followers = $followers;

        return $this;
    }

    #[Groups('profile')]
    public function getFollowersCount(): int
    {
        return $this->followers->count();
    }

    #[Groups('profile')]
    public function getFollowingCount(): int
    {
        return $this->following->count();
    }

    public function addFollowing(self $user): static
    {
        if (!$this->following->contains($user)) {
            $this->following->add($user);
            $user->getFollowers()->add($this);
        }

        return $this;
    }

    public function removeFollowing(self $user): static
    {
        if ($this->following->removeElement($user)) {
            $user->getFollowers()->removeElement($this);
        }

        return $this;
    }
}
