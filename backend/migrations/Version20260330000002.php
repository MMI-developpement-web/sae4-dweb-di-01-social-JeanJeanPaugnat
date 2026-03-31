<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260330000002 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add user_blocked join table for user-to-user blocking';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE user_blocked (user_source INT NOT NULL, user_target INT NOT NULL, INDEX IDX_USER_BLOCKED_SOURCE (user_source), INDEX IDX_USER_BLOCKED_TARGET (user_target), PRIMARY KEY(user_source, user_target)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE user_blocked ADD CONSTRAINT FK_USER_BLOCKED_SOURCE FOREIGN KEY (user_source) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_blocked ADD CONSTRAINT FK_USER_BLOCKED_TARGET FOREIGN KEY (user_target) REFERENCES `user` (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user_blocked DROP FOREIGN KEY FK_USER_BLOCKED_SOURCE');
        $this->addSql('ALTER TABLE user_blocked DROP FOREIGN KEY FK_USER_BLOCKED_TARGET');
        $this->addSql('DROP TABLE user_blocked');
    }
}
