from pint import UnitRegistry

ureg = UnitRegistry()

ureg.define("Hertz = hertz")
ureg.define("Newton = newton")
ureg.define("Joule = joule")

UnitQuantity = ureg.Quantity
