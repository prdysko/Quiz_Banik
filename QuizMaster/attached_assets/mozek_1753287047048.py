class mozek:

    def __init__(self, lístek_otázek):
        self.číslo_otázky = 0
        self.score = 0  
        self.list_otázek = lístek_otázek
    
    def další_otázku(self):
        otázka_ted = self.list_otázek[self.číslo_otázky]
        self.číslo_otázky += 1
        odpověd = input(f"Otázka č{self.číslo_otázky}: {otázka_ted.text}(True/False): ")
        self.odpověd_kontroler(odpověd, otázka_ted.answer)    
    
    def odpověd_kontroler(self, hračova_odpověd, správná_odpověd):
        if hračova_odpověd.lower() == správná_odpověd.lower():
            print("Správně!")
            self.score += 1
            print(f"Tvoje skóre je: {self.score}/{self.číslo_otázky}")
        else:
            print("Špatně!")
            print(f"Správná odpověď je: {správná_odpověd}")
            print(f"Tvoje skóre je: {self.score}/{self.číslo_otázky}")


    
    def je_konec(self):
        if self.číslo_otázky >= len(self.list_otázek):
            return False
        else:  
            return True
        
   
