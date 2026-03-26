<?php


namespace App\Security;

use App\Repository\AccessTokenRepository; // Assurez-vous d'avoir bien créé votre repository pour l'entité AccessToken
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Http\AccessToken\AccessTokenHandlerInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;

class AccessTokenHandler implements AccessTokenHandlerInterface
{
    public function __construct(
        private AccessTokenRepository $accessTokenRepository
    ) {
    }

    /**
     * @param string $accessToken Le token brut envoyé par le client (dans le header Authorization: Bearer ...)
     */
    public function getUserBadgeFrom(string $accessToken): UserBadge
    {
        // 1. Rechercher l'entité AccessToken correspondante
        $token = $this->accessTokenRepository->findOneBy(['value' => $accessToken]);

        if (null === $token) {
            // Le jeton est inconnu ou invalide
            throw new BadCredentialsException('Invalid token.');
        }



        // Si vous avez hashé le token en base, il faudrait le hacher ici avant de le comparer.
        // if ($hashedToken !== $token->getValue()) { ... } 
        // Mais pour l'instant, on suppose que le token est stocké en clair (comme l'énoncé)
        
        // 2. Récupérer l'utilisateur
        $user = $token->getUser();
        
        if (!$user || $user->getIsBlocked()) {
            throw new CustomUserMessageAuthenticationException('Votre compte a été suspendu pour non-respect des conditions.');
        }
        // 3. Retourner un UserBadge avec l'identifiant de l'utilisateur.
        // !!! IMPORTANT : Utilisez la propriété qui identifie l'utilisateur dans votre provider (généralement l'email)
        return new UserBadge($user->getEmail());
    }
}