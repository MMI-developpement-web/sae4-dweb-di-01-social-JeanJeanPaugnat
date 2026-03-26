<?php

namespace App\Controller\Admin;

use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
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
            BooleanField::new('isAdmin', 'Compte Admin')
                ->renderAsSwitch(true),
            BooleanField::new('isBlocked', 'Compte Bloqué')
                ->renderAsSwitch(true)
                ->setHelp('Un utilisateur bloqué ne peut plus se connecter.'),
            TextField::new('biography')->hideOnIndex(),
            TextField::new('location')->hideOnIndex(),
            TextField::new('website')->hideOnIndex(),
            TextField::new('avatar')->hideOnIndex(),
            TextField::new('banner')->hideOnIndex(),
        ];
    }

    // Ajout d'un getter/setter virtuel pour le toggle admin
    // et surcharge des méthodes persistEntity/updateEntity pour gérer le rôle
    public function persistEntity(\Doctrine\Persistence\ObjectManager $entityManager, $entityInstance): void
    {
        if ($entityInstance instanceof \App\Entity\User) {
            $this->handleAdminRole($entityInstance);
        }
        parent::persistEntity($entityManager, $entityInstance);
    }

    public function updateEntity(\Doctrine\Persistence\ObjectManager $entityManager, $entityInstance): void
    {
        if ($entityInstance instanceof \App\Entity\User) {
            $this->handleAdminRole($entityInstance);
        }
        parent::updateEntity($entityManager, $entityInstance);
    }

    private function handleAdminRole(\App\Entity\User $user): void
    {
        $roles = $user->getRoles();
        $isAdmin = $user->isAdmin();
        if ($isAdmin && !in_array('ROLE_ADMIN', $roles)) {
            $roles[] = 'ROLE_ADMIN';
        } elseif (!$isAdmin && in_array('ROLE_ADMIN', $roles)) {
            $roles = array_diff($roles, ['ROLE_ADMIN']);
        }
        $user->setRoles(array_values($roles));
    }

}
