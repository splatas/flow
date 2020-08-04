FILE=config/variables.js
if ! -f "$FILE";
	then echo "NO EXISTE";
	else cat "$FILE"
fi
