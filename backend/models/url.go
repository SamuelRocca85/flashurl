package models

import (
	"time"

	"gorm.io/gorm"
)

type Url struct {
	ID        string `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	LongUrl   string         `json:"long_url"`
	ShortUrl  string         `json:"short_url" gorm:"unique"`
}
