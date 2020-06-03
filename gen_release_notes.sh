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

rm -rf release ; mkdir release

range="${prev}...${version}"
fileOnly="release_notes_${PROJECT}_${prev}_${version}"
outOnly="${PROJECT}-${version}"
file="release/${fileOnly}.rst"

if [ ! -d release ] ; then mkdir release ; fi
echo "Generando documento reStructuredText"

echo "\
================================
Base Jaxx :: Notas de versión
================================

-------
Versión
-------

* Actualmente en producción está la versión **${prev}**
* Se sube a la versión **${version}**

----------
Despliegue
----------

* El proceso de despliegue es vía Gitlab CI/CD http://10.200.172.71/backend/${project}/pipelines/new
* Definiendo la ejecución en el tag ${version} y la variable **NODE_ENV** con valor **prod**.

--------
Registro
--------
" > $file

git log $range --pretty='* %s' --abbrev-commit --reverse | sed '/^\* [m,M]erge/d' | uniq >> $file

echo "\

.. Documento generado via: rst2pdf (or rst2html5) -s sphinx ${file}
.. ver dos últimos tags: git tag -l --sort=v:refname | tail -n2" >> $file

echo "Generando PDF/HTML"
cd release
rst2html5 ${fileOnly}.rst > ${outOnly}.html
xz ${outOnly}.html
