<?php

namespace App\Controller\Admin;

use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ArrayField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class UserCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->onlyOnIndex(),
            TextField::new('username'),
            EmailField::new('email'),
            ArrayField::new('roles'),
            // TextField::new('password')->onlyOnForms(),
        ];
    }
    // // Hash le mot de passe lors de la création d'un utilisateur
    // use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
    // use Doctrine\Persistence\ObjectManager;

    // public function __construct(private UserPasswordHasherInterface $passwordHasher)
    // {
    // }

    // public function persistEntity(ObjectManager $entityManager, $entityInstance): void
    // {
    //     if ($entityInstance instanceof User) {
    //         $plainPassword = $entityInstance->getPassword();
    //         if ($plainPassword) {
    //             $hashedPassword = $this->passwordHasher->hashPassword($entityInstance, $plainPassword);
    //             $entityInstance->setPassword($hashedPassword);
    //         }
    //     }
    //     parent::persistEntity($entityManager, $entityInstance);
    // }
}
