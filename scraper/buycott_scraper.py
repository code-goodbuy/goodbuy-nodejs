#!/usr/bin/env python3
# *_* coding: utf-8 *_*

import requests
from bs4 import BeautifulSoup


print("Buycott scraper called")


class BuycottScraper:
    def __init__(self, code):
        self.product = { "code": code.decode("utf-8")}
        self.url = "https://www.buycott.com/upc"
        self.wanted_infos = ("Brand", "Manufacturer", "Country")
        self.soup = ""

    def get_soup(self):
        url = self.url + "/" + self.product["code"] + "/"
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")
        return soup

    def get_product_name(self, soup):
        return soup.find("h2").text

    def product_info_table(self, soup):
        return soup.find("table", attrs={"class": "table product_info_table"})

    def pars_info_table(self, product_info_table):
        return [
            (td.text, product_info_table("td")[i + 1].text)
            for i, td in enumerate(product_info_table("td"))
            if td.text in self.wanted_infos
        ]

    def get_product_brand(self, list):
        return [tup[1] for tup in list if tup[0] == "Brand"][0]

    def get_product_image(self, soup):
        return soup.find("img").attrs["src"]

    def scrape(self):
        soup = self.get_soup()
        self.product["name"] = self.get_product_name(soup)
        self.product["scraped_image"] = self.get_product_image(soup)
        self.product["brand"] = self.get_product_brand(
            list=self.pars_info_table(self.product_info_table(soup))
        )
        self.product["state"] = "306"
        return self.product
