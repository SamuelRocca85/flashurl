package routes

import (
	"github.com/SamuelRocca85/flashurl/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.POST("/shorten", controllers.Shorten)
	r.GET("/:id", controllers.RedirectUrl)
	r.GET("/urls", controllers.GetUrls)
}
