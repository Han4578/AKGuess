from born_race_parser import parseBornRace 
from icon_parser import parseIcons
from class_parser import parseSubClasses, updateClassSubclass
from faction_parser import parseFactions, updateFactionSubfaction
from character_parser import parseCharacterTable

parseCharacterTable()
parseBornRace()
parseIcons()
parseSubClasses()
updateClassSubclass()
parseFactions()
updateFactionSubfaction()