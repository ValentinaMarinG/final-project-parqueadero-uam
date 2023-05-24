class Parking:
    def __init__(self, name, type, numberofCars, payable, price, plate,payments, categoryId):
        self.name = name
        self.type = type
        self.numberofCars = numberofCars
        self.payable = payable
        self.price = price
        self.plate = plate
        self.payments = payments
        self.categoryId = categoryId

    @staticmethod
    def to_json(Parking):
        return Parking.__dict__
    
    def __repr__(self) -> str:
        return f"Parking >>> {self.name}"
    
