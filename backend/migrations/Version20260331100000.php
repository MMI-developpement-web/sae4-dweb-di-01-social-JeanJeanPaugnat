<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260331100000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add isCensored column to post table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE post ADD is_censored TINYINT(1) NOT NULL DEFAULT 0');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE post DROP is_censored');
    }
}
