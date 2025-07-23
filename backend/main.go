package main

import (
	"log"

	"github.com/SamuelRocca85/flashurl/config"
	"github.com/SamuelRocca85/flashurl/models"
	"github.com/SamuelRocca85/flashurl/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db := config.GetDB()
	db.AutoMigrate(&models.Url{})

	r := gin.Default()
	r.Use(cors.Default())
	routes.SetupRoutes(r)
	r.Run(":" + config.GetEnv("PORT", "3000"))
}
