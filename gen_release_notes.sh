#/usr/bin/bash

if [ $# -lt 1 ] ; then
  echo Usage: $0 tag1 tag2
  exit 1
fi

prev=$1
if [ $# -gt 1 ] ; then
  version=$2
else
  version=$(git tag -l --sort=v:refname | tail -n1)
fi

range="${prev}...${version}"
fileOnly="release_notes_eventapi_${prev}_${version}.rst"
file="release/${fileOnly}"

if [ ! -d release ] ; then mkdir release ; fi
echo "Generando documento reStructuredText"

echo "\
=============================
Event API :: Notas de versión
=============================

-------
Versión
-------

* Actualmente en producción está la versión **${prev}**
* Se sube a la versión **${version}**

-------
Cambios
-------

* @TODO *detallar*
* @TODO *cambios*
* @TODO *funcionalmente*

----------
Despliegue
----------

* Generar un directorio temporal donde se ejecutará el despliegue
* $ cd \$(mktemp -d)
* Copiar/mover el par de claves ssl que permite acceso a los servidores un nivel arriba de este directorio
* $ mv path/to/shipitfile_ev_${version}.js shipitfile.js
* $ npm i shipit-deploy
* $ DEPLOY_BRANCH=${version} npx shipit-cli prod deploy
* Si las pruebas fallan no sube la nueva versión y no hace falta tomar acción
* Si las pruebas no fallan pero luego se considera que hay que retroceder de versión (rollback)

---------
Retroceso
---------

El proceso de rollback es:

  $ npx shipit-cli prod rollback

--------
Registro
--------
" > $file
git log $range --pretty='* %s' --abbrev-commit --reverse >> $file

echo  "\

--------
Archivos
--------
" >> $file
git diff --name-only $range | sed 's/^/* /' >> $file

echo "\

.. Documento generado via: rst2pdf -s sphinx ${file}
.. ver dos últimos tags: git tag -l --sort=v:refname | tail -n2
" >> $file

cp shipitfile.js release/shipitfile_ev_${version}.js
cp doc/swagger.json release/swagger_ev_${version}.json

echo "Generando PDF"
cd release && rst2pdf -s sphinx $fileOnly

echo "Por favor modificar título y cambios funcionales, y volver a generar el pdf"
