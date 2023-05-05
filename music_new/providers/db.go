package providers

import (
	"database/sql"
	"fmt"

	"github.com/zanz1n/duvua-bot/music/internal/dba"
)

type DbProviderParams struct {
	Uri          string
	SSLMode      string
	MaxOpenConns uint8
}

func NewDbProvider(params DbProviderParams) (*dba.Queries, *sql.DB, error) {
	conn, err := sql.Open("postgres", fmt.Sprintf("%s&sslmode=%s", params.Uri, params.SSLMode))

	if err != nil {
		return nil, nil, err
	}

	conn.SetMaxOpenConns(int(params.MaxOpenConns))

	dba := dba.New(conn)

	return dba, conn, nil
}
