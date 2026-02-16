from pint import UnitRegistry

ureg = UnitRegistry()
ureg.define("Hertz = 1 / s")
UnitQuantity = ureg.Quantity
