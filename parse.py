#!/usr/bin/env python2.7

from bs4 import BeautifulSoup
import json
import sys

html = ''
for line in sys.stdin:
    html += line

html = html.replace('</tr>', '')
soup = BeautifulSoup(html, 'html.parser')

data = []
c = 0
col = {}
cells = soup.find('tbody').find_all('td')
for cell in cells:
    c += 1
    if c == 1:
        a = cell.find('a', href=True)
        col['crn'] = a.contents[0]
        col['link'] = a['href']
    elif c == 2:
        col['courseId'] = cell.contents[0]
    elif c == 3:
        col['attr'] = cell.contents[0]
    elif c == 4:
        col['title'] = cell.contents[0]
    elif c == 5:
        col['instructor'] = cell.contents[0]
    elif c == 6:
        col['creditHours'] = cell.contents[0]
    elif c == 7:
        col['meetDays'] = cell.contents[0]
    elif c == 8:
        col['meetTimes'] = cell.contents[0]
    elif c == 9:
        col['seats'] = cell.contents[0]
    elif c == 10:
        col['currEnr'] = cell.contents[0]
    elif c == 11:
        col['seatsAvail'] = cell.contents[0]
    elif c == 12:
        col['status'] = cell.contents[0]
        c = 0
        data.append(col)
        col = {}

print json.dumps(data)
