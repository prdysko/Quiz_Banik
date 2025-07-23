from otázky import Question
from data import question_data
from mozek import mozek

list_otázek = []

for jedna_otázka in question_data:
    text_otázky = jedna_otázka["text"]
    odpověď_otázky = jedna_otázka["answer"]
    nová_otázka = Question(text_otázky, odpověď_otázky)
    list_otázek.append(nová_otázka)

print(list_otázek[0].text)
print(list_otázek[0].answer)

kvíz = mozek(list_otázek)


while kvíz.je_konec() == True:
    kvíz.další_otázku()
print(f"Tvé konečné skóre je: {kvíz.score}/{len(list_otázek)}")




