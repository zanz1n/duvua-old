// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.18.0

package dba

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"time"
)

type AnimeAttributesAgeRating string

const (
	AnimeAttributesAgeRatingG   AnimeAttributesAgeRating = "G"
	AnimeAttributesAgeRatingPG  AnimeAttributesAgeRating = "PG"
	AnimeAttributesAgeRatingR   AnimeAttributesAgeRating = "R"
	AnimeAttributesAgeRatingR18 AnimeAttributesAgeRating = "R18"
)

func (e *AnimeAttributesAgeRating) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = AnimeAttributesAgeRating(s)
	case string:
		*e = AnimeAttributesAgeRating(s)
	default:
		return fmt.Errorf("unsupported scan type for AnimeAttributesAgeRating: %T", src)
	}
	return nil
}

type NullAnimeAttributesAgeRating struct {
	AnimeAttributesAgeRating AnimeAttributesAgeRating
	Valid                    bool // Valid is true if AnimeAttributesAgeRating is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullAnimeAttributesAgeRating) Scan(value interface{}) error {
	if value == nil {
		ns.AnimeAttributesAgeRating, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.AnimeAttributesAgeRating.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullAnimeAttributesAgeRating) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.AnimeAttributesAgeRating), nil
}

type AnimeAttributesStatus string

const (
	AnimeAttributesStatusCURRENT    AnimeAttributesStatus = "CURRENT"
	AnimeAttributesStatusFINISHED   AnimeAttributesStatus = "FINISHED"
	AnimeAttributesStatusTBA        AnimeAttributesStatus = "TBA"
	AnimeAttributesStatusUNRELEASED AnimeAttributesStatus = "UNRELEASED"
	AnimeAttributesStatusUPCOMING   AnimeAttributesStatus = "UPCOMING"
)

func (e *AnimeAttributesStatus) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = AnimeAttributesStatus(s)
	case string:
		*e = AnimeAttributesStatus(s)
	default:
		return fmt.Errorf("unsupported scan type for AnimeAttributesStatus: %T", src)
	}
	return nil
}

type NullAnimeAttributesStatus struct {
	AnimeAttributesStatus AnimeAttributesStatus
	Valid                 bool // Valid is true if AnimeAttributesStatus is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullAnimeAttributesStatus) Scan(value interface{}) error {
	if value == nil {
		ns.AnimeAttributesStatus, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.AnimeAttributesStatus.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullAnimeAttributesStatus) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.AnimeAttributesStatus), nil
}

type AnimeAttributesSubType string

const (
	AnimeAttributesSubTypeONA     AnimeAttributesSubType = "ONA"
	AnimeAttributesSubTypeOVA     AnimeAttributesSubType = "OVA"
	AnimeAttributesSubTypeTV      AnimeAttributesSubType = "TV"
	AnimeAttributesSubTypeMOVIE   AnimeAttributesSubType = "MOVIE"
	AnimeAttributesSubTypeMUSIC   AnimeAttributesSubType = "MUSIC"
	AnimeAttributesSubTypeSPECIAL AnimeAttributesSubType = "SPECIAL"
)

func (e *AnimeAttributesSubType) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = AnimeAttributesSubType(s)
	case string:
		*e = AnimeAttributesSubType(s)
	default:
		return fmt.Errorf("unsupported scan type for AnimeAttributesSubType: %T", src)
	}
	return nil
}

type NullAnimeAttributesSubType struct {
	AnimeAttributesSubType AnimeAttributesSubType
	Valid                  bool // Valid is true if AnimeAttributesSubType is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullAnimeAttributesSubType) Scan(value interface{}) error {
	if value == nil {
		ns.AnimeAttributesSubType, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.AnimeAttributesSubType.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullAnimeAttributesSubType) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.AnimeAttributesSubType), nil
}

type MemberJob string

const (
	MemberJobMENDIGO MemberJob = "MENDIGO"
)

func (e *MemberJob) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = MemberJob(s)
	case string:
		*e = MemberJob(s)
	default:
		return fmt.Errorf("unsupported scan type for MemberJob: %T", src)
	}
	return nil
}

type NullMemberJob struct {
	MemberJob MemberJob
	Valid     bool // Valid is true if MemberJob is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullMemberJob) Scan(value interface{}) error {
	if value == nil {
		ns.MemberJob, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.MemberJob.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullMemberJob) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.MemberJob), nil
}

type WCType string

const (
	WCTypeMESSAGE WCType = "MESSAGE"
	WCTypeIMAGE   WCType = "IMAGE"
	WCTypeEMBED   WCType = "EMBED"
)

func (e *WCType) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = WCType(s)
	case string:
		*e = WCType(s)
	default:
		return fmt.Errorf("unsupported scan type for WCType: %T", src)
	}
	return nil
}

type NullWCType struct {
	WCType WCType
	Valid  bool // Valid is true if WCType is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullWCType) Scan(value interface{}) error {
	if value == nil {
		ns.WCType, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.WCType.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullWCType) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.WCType), nil
}

type Anime struct {
	ID                  int32                        `json:"id"`
	KitsuId             string                       `json:"kitsuId"`
	Slug                string                       `json:"slug"`
	CreatedAt           string                       `json:"createdAt"`
	UpdatedAt           string                       `json:"updatedAt"`
	StartDate           sql.NullString               `json:"startDate"`
	EndDate             sql.NullString               `json:"endDate"`
	Synopsis            string                       `json:"synopsis"`
	SynopsisEn          string                       `json:"synopsisEn"`
	CoverImageTopOffset sql.NullInt32                `json:"coverImageTopOffset"`
	TitlesEn            sql.NullString               `json:"titlesEn"`
	TitlesEnJp          sql.NullString               `json:"titlesEnJp"`
	TitlesJaJp          sql.NullString               `json:"titlesJaJp"`
	CanonicalTitle      sql.NullString               `json:"canonicalTitle"`
	AbbreviatedTitles   []string                     `json:"abbreviatedTitles"`
	AverageRating       sql.NullString               `json:"averageRating"`
	RatingFrequencies   sql.NullString               `json:"ratingFrequencies"`
	UserCount           sql.NullInt32                `json:"userCount"`
	FavoritesCount      sql.NullInt32                `json:"favoritesCount"`
	PopularityRank      sql.NullInt32                `json:"popularityRank"`
	RatingRank          sql.NullInt32                `json:"ratingRank"`
	AgeRating           NullAnimeAttributesAgeRating `json:"ageRating"`
	AgeRatingGuide      sql.NullString               `json:"ageRatingGuide"`
	Subtype             NullAnimeAttributesSubType   `json:"subtype"`
	Status              NullAnimeAttributesStatus    `json:"status"`
	Tba                 sql.NullString               `json:"tba"`
	PosterImageTiny     sql.NullString               `json:"posterImageTiny"`
	PosterImageSmall    sql.NullString               `json:"posterImageSmall"`
	PosterImageMedium   sql.NullString               `json:"posterImageMedium"`
	PosterImageLarge    sql.NullString               `json:"posterImageLarge"`
	PosterImageOriginal sql.NullString               `json:"posterImageOriginal"`
	PosterImageMeta     sql.NullString               `json:"posterImageMeta"`
	CoverImageTiny      sql.NullString               `json:"coverImageTiny"`
	CoverImageSmall     sql.NullString               `json:"coverImageSmall"`
	CoverImageLarge     sql.NullString               `json:"coverImageLarge"`
	CoverImageOriginal  sql.NullString               `json:"coverImageOriginal"`
	CoverImageMeta      sql.NullString               `json:"coverImageMeta"`
	EpisodeCount        sql.NullInt32                `json:"episodeCount"`
	EpisodeLength       sql.NullInt32                `json:"episodeLength"`
	YoutubeVideoId      sql.NullString               `json:"youtubeVideoId"`
	ShowType            NullAnimeAttributesSubType   `json:"showType"`
	Nsfw                sql.NullBool                 `json:"nsfw"`
	Genres              []string                     `json:"genres"`
}

type AnimeReference struct {
	ID        int32     `json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Value     string    `json:"value"`
	AnimeId   int32     `json:"animeId"`
}

type Guild struct {
	ID            int32     `json:"id"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
	DcId          string    `json:"dcId"`
	Prefix        string    `json:"prefix"`
	EnableTickets bool      `json:"enableTickets"`
	MusicStrictM  bool      `json:"musicStrictM"`
}

type Member struct {
	ID          int32     `json:"id"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	MCID        string    `json:"MCID"`
	SilverCoins int32     `json:"silverCoins"`
	XP          int32     `json:"XP"`
	Level       int32     `json:"level"`
	Dj          bool      `json:"dj"`
	PlayAllowed bool      `json:"playAllowed"`
	GuildId     string    `json:"guildId"`
	UserId      string    `json:"userId"`
}

type User struct {
	ID           int32     `json:"id"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
	DcId         string    `json:"dcId"`
	LastDailyReq string    `json:"lastDailyReq"`
	Job          MemberJob `json:"job"`
	GoldCoins    int32     `json:"goldCoins"`
}

type Welcome struct {
	ID        int32          `json:"id"`
	Enabled   bool           `json:"enabled"`
	ChannelId sql.NullString `json:"channelId"`
	Message   string         `json:"message"`
	Type      WCType         `json:"type"`
	GuildDcId string         `json:"guildDcId"`
}