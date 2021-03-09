include node_modules/fatigue-scripts/webapp.mk

upgrade-gitlab:
	grep -Eo '^\s+\"([^\"]+).+git\.kaiostech\.com' package.json | cut -d: -f1;
	grep -Eo '^\s+\"([^\"]+).+git\.kaiostech\.com' package.json | cut -d: -f1 | xargs yarn upgrade;
