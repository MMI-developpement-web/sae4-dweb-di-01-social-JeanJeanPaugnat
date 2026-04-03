<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260402000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add retweet fields to post table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE post ADD is_retweet TINYINT(1) DEFAULT 0 NOT NULL, ADD retweet_author VARCHAR(255) DEFAULT NULL, ADD retweet_comment LONGTEXT DEFAULT NULL, ADD retweets_count INT DEFAULT 0 NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE post DROP is_retweet, DROP retweet_author, DROP retweet_comment, DROP retweets_count');
    }
}
