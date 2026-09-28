#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Prepara los PNG generados por IA para la web y los audita.

    python scripts/preparar-assets.py

Lee de   assets-raw/
Escribe  public/ingredientes/*.webp  y  public/taco/*.webp

Dos tratamientos distintos, y la diferencia importa:

  INGREDIENTES  se recortan al contenido. Cada uno va a su aire, así que
                sobra cualquier margen transparente: si lo dejas, el recorte
                se ve más pequeño de lo que ocupa y descuadra la composición.

  ESTADOS       NO se recortan. Se generaron encadenando ediciones sobre la
                misma tortilla, así que ya están alineados entre sí. Recortar
                al contenido los DESALINEARÍA, porque la silueta crece al
                añadir relleno y cada uno acabaría con un encuadre distinto.
                Solo se escalan al mismo lienzo cuadrado.

Además audita el borde de cada alfa: un halo verde (croma mal quitado) o un
halo oscuro (matte residual) no se ven sobre fondo negro y cantan sobre el
crema de la web. Aquí se miden en vez de mirarlos a ojo.
"""

import os
import sys

import numpy as np
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGEN = os.path.join(RAIZ, "assets-raw")

INGREDIENTES = ["tortilla", "pollo", "patatas", "queso", "algerienne", "harissa"]
ESTADOS = ["estado-0-base", "estado-1-carne", "estado-2-queso", "estado-3-salsa"]

LADO_INGREDIENTE = 440
LIENZO_ESTADO = 760


def cargar(ruta):
    im = Image.open(ruta)
    return im.convert("RGBA")


def recortar_al_contenido(im, umbral=8):
    """Quita el margen transparente. Solo para ingredientes."""
    a = np.array(im)[:, :, 3]
    filas = np.where(a.max(axis=1) > umbral)[0]
    cols = np.where(a.max(axis=0) > umbral)[0]
    if len(filas) == 0 or len(cols) == 0:
        return im
    return im.crop((cols[0], filas[0], cols[-1] + 1, filas[-1] + 1))


def escalar_lado_mayor(im, lado):
    w, h = im.size
    if max(w, h) <= lado:
        return im
    f = lado / float(max(w, h))
    return im.resize((max(1, int(round(w * f))), max(1, int(round(h * f)))), Image.LANCZOS)


def a_lienzo_cuadrado(im, lado):
    """Escala conservando el encuadre y lo centra en un cuadrado. No recorta."""
    im = escalar_lado_mayor(im, lado)
    fondo = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    fondo.paste(im, ((lado - im.size[0]) // 2, (lado - im.size[1]) // 2), im)
    return fondo


def auditar_borde(im):
    """
    Mira el anillo de píxeles del borde (alfa parcial) y devuelve si domina
    el verde o si hay halo oscuro. Es justo lo que no se ve sobre negro.
    """
    arr = np.array(im).astype(np.int16)
    a = arr[:, :, 3]
    borde = (a > 16) & (a < 240)
    n = int(borde.sum())
    if n < 40:
        return {"px_borde": n, "veredicto": "sin borde parcial que medir"}

    r = arr[:, :, 0][borde].mean()
    g = arr[:, :, 1][borde].mean()
    b = arr[:, :, 2][borde].mean()
    luz = (r + g + b) / 3.0
    # Dominante verde REAL: tiene que superar al rojo Y al azul.
    # Compararlo contra la media de ambos daba falso positivo en todo lo
    # amarillo o anaranjado (el queso fundido), porque el azul bajo hunde
    # la media. Un borde de queso es 233,174,75: verde alto, pero el rojo
    # lo supera, así que no es croma.
    verde = g - max(r, b)

    avisos = []
    if verde > 10:
        avisos.append("HALO VERDE (+%.0f)" % verde)
    if luz < 60:
        avisos.append("HALO OSCURO (luz %.0f)" % luz)
    return {
        "px_borde": n,
        "rgb": "%.0f,%.0f,%.0f" % (r, g, b),
        "verde": round(float(verde), 1),
        "luz": round(float(luz), 1),
        "veredicto": " + ".join(avisos) if avisos else "limpio",
    }


def procesar(nombre, destino_dir, cuadrado, calidad):
    origen = os.path.join(ORIGEN, nombre + ".png")
    if not os.path.exists(origen):
        return (nombre, None, "FALTA " + os.path.relpath(origen, RAIZ))

    im = cargar(origen)
    entrada = im.size
    if cuadrado:
        im = a_lienzo_cuadrado(im, LIENZO_ESTADO)
    else:
        im = escalar_lado_mayor(recortar_al_contenido(im), LADO_INGREDIENTE)

    audit = auditar_borde(im)

    os.makedirs(destino_dir, exist_ok=True)
    salida = os.path.join(destino_dir, nombre + ".webp")
    # Calidad adaptativa: baja por escalones hasta entrar en presupuesto en
    # vez de fijar un numero a ojo. Suelo en 62, por debajo se ve el bloqueo.
    limite = 62 if cuadrado else 42
    q = calidad
    while True:
        im.save(salida, "WEBP", quality=q, method=6, lossless=False)
        kb = os.path.getsize(salida) / 1024.0
        if kb <= limite or q <= 62:
            break
        q -= 4
    calidad_final = q

    return (nombre, {
        "entrada": "%dx%d" % entrada,
        "salida": "%dx%d" % im.size,
        "kb": round(kb, 1),
        "q": calidad_final,
        "borde": audit,
    }, None)


def main():
    if not os.path.isdir(ORIGEN):
        print("No existe %s" % os.path.relpath(ORIGEN, RAIZ))
        print("Crea la carpeta y deja dentro los PNG con estos nombres:")
        for n in INGREDIENTES + ESTADOS:
            print("   %s.png" % n)
        return 1

    filas = []
    for n in INGREDIENTES:
        filas.append(procesar(n, os.path.join(RAIZ, "public", "ingredientes"), False, 82))
    for n in ESTADOS:
        filas.append(procesar(n, os.path.join(RAIZ, "public", "taco"), True, 80))

    print("%-18s %-11s %-9s %3s %7s  %s" % ("asset", "entrada", "salida", "q", "KB", "borde"))
    print("-" * 78)
    total = 0.0
    problemas = []
    for nombre, info, err in filas:
        if err:
            print("%-18s %s" % (nombre, err))
            problemas.append("%s: %s" % (nombre, err))
            continue
        total += info["kb"]
        b = info["borde"]
        print("%-18s %-11s %-9s %3d %7.1f  %s" % (
            nombre, info["entrada"], info["salida"], info["q"], info["kb"], b["veredicto"]))
        if b["veredicto"] not in ("limpio", "sin borde parcial que medir"):
            problemas.append("%s: %s (rgb %s)" % (nombre, b["veredicto"], b.get("rgb", "?")))
        limite = 68 if nombre.startswith("estado-") else 48
        if info["kb"] > limite:
            problemas.append("%s: %.1f KB, pasa del limite de %d" % (nombre, info["kb"], limite))

    print("-" * 78)
    print("total: %.1f KB" % total)

    # Los 4 estados tienen que quedar EXACTAMENTE del mismo tamaño o vibran.
    tam = set()
    for n in ESTADOS:
        p = os.path.join(RAIZ, "public", "taco", n + ".webp")
        if os.path.exists(p):
            tam.add(Image.open(p).size)
    if len(tam) > 1:
        problemas.append("los 4 estados no miden igual: %s" % tam)

    if problemas:
        print("\nA REVISAR:")
        for p in problemas:
            print("  - " + p)
    else:
        print("\nTodo limpio.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
