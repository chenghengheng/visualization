# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

import json

with open(f"./data/weibo_data_index_group_importance.json", encoding="utf-8") as json_file:  
    weibos = json.load(json_file)

weibo_new = []
for weibo in weibos:
    weibo_new.append(weibo['children'][0])
    
with open(f"./data/weibo_data_label_index_new.json", "w", encoding="utf-8") as outfile: 
    outfile.write(json.dumps(weibo_new, indent=2))