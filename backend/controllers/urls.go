package controllers

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"net/url"

	"github.com/PuerkitoBio/goquery"
	"github.com/SamuelRocca85/flashurl/config"
	"github.com/SamuelRocca85/flashurl/models"
	"github.com/gin-gonic/gin"
)

func isValidURL(urlStr string) bool {
	_, err := url.ParseRequestURI(urlStr)
	if err != nil {
		return false
	}

	u, err := url.Parse(urlStr)
	if err != nil || u.Scheme == "" || u.Host == "" {
		return false
	}
	var hosts = strings.Split(u.Host, ".")
	if len(hosts) != 2 || hosts[0] == "" || hosts[1] == "" {
		return false
	}
	return true
}

func generateID(length int) (string, error) {
	randomBytes := make([]byte, length)
	_, err := io.ReadFull(rand.Reader, randomBytes)
	if err != nil {
		return "", err
	}

	return base64.URLEncoding.EncodeToString(randomBytes), nil
}

func fetchUrlMetadata(url string) (map[string]any, error) {
	res, err := http.Get(url)

	if err != nil {
		return nil, errors.New("error while loading url metadata")
	}

	defer res.Body.Close()

	doc, err := goquery.NewDocumentFromReader(res.Body)

	if err != nil {
		return nil, errors.New("error while loading url metadata")
	}

	var md map[string]any = make(map[string]any)
	md["title"] = doc.Find("title").Text()

	doc.Find("meta").Each(func(i int, s *goquery.Selection) {

		name, existsName := s.Attr("name")
		property, existsProperty := s.Attr("property")
		var value string

		if existsName {
			value = name
		} else if existsProperty {
			value = property
		}

		if existsName || existsProperty {
			content, _ := s.Attr("content")
			splitName := strings.Split(value, ":")

			if len(splitName) == 2 || splitName[0] == "og" || splitName[0] == "twitter" {
				md[splitName[1]] = content
			}
		}
	})

	return md, nil
}

type UrlDTO struct {
	Url string `json:"url"`
}

func Shorten(c *gin.Context) {
	var data UrlDTO

	if err := c.BindJSON(&data); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "An unexpected error ocurred",
		})
		log.Fatalln("[Urls_Shorten]: Error ocurred during json data binding")
		return
	}

	if data.Url == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Url was not provided",
		})
		return
	}
	// if !isValidURL(data.Url) {
	// 	c.JSON(http.StatusBadRequest, gin.H{
	// 		"message": data.Url + " is not a valid url",
	// 	})
	// 	return
	// }
	var url models.Url
	id, err := generateID(8)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Something went wrong, try again later",
		})
		log.Fatalln("[Urls_Shorten]: Error while generating unique ID")
		return
	}
	url.ID = id
	url.LongUrl = data.Url
	url.ShortUrl = os.Getenv("SITE_URL") + "/" + id
	db := config.GetDB()

	metadata, err := fetchUrlMetadata(data.Url)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Something went wrong, try again later"})
		return
	}

	for k, v := range metadata {
		fmt.Printf("%s: %s\n", k, v)
	}

	result := db.Create(&url)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Something went wrong, try again later",
		})
		log.Fatalln("[Urls_SHorten]: Error while creating url")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": &url,
	})
}

func RedirectUrl(c *gin.Context) {
	id, found := c.Params.Get("id")

	if !found {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ID",
		})
		return
	}

	var url models.Url

	db := config.GetDB()
	result := db.First(&url, "id = ?", id)

	if result.Error != nil {
		message := result.Error.Error()
		if message == "record not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "url not found",
			})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Something went wrong",
			})
		}
		return
	}

	if url.LongUrl != "" {
		c.Header("Location", url.LongUrl)
		c.JSON(http.StatusTemporaryRedirect, gin.H{
			"message": "Redirecting to url",
		})
	}
}

func GetUrls(c *gin.Context) {
	var urls []models.Url
	db := config.GetDB()
	db.Find(&urls)
	c.JSON(http.StatusOK, urls)
}

func GetUrl(c *gin.Context) {
	id := c.Param("id")

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid ID",
		})
		return
	}

	var url models.Url

	db := config.GetDB()
	result := db.First(&url, "id = ?", id)

	if result.Error != nil {
		message := result.Error.Error()
		if message == "record not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "url not found",
			})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Something went wrong",
			})
		}
		return
	}

	c.JSON(http.StatusOK, url)
}
