<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260331144133 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE post ADD is_censored TINYINT DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE user_blocked RENAME INDEX idx_user_blocked_source TO IDX_8258F58A3AD8644E');
        $this->addSql('ALTER TABLE user_blocked RENAME INDEX idx_user_blocked_target TO IDX_8258F58A233D34C1');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE post DROP is_censored');
        $this->addSql('ALTER TABLE user_blocked RENAME INDEX idx_8258f58a233d34c1 TO IDX_USER_BLOCKED_TARGET');
        $this->addSql('ALTER TABLE user_blocked RENAME INDEX idx_8258f58a3ad8644e TO IDX_USER_BLOCKED_SOURCE');
    }
}
