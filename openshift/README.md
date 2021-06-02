El archivo template.yaml genera todos los componentes necesarios para deployar la aplicación:
- Deployment.
- Service.
- Route, etc.

Definirá la configuración por default de la aplicación.
Posteriormente, si se desea aplicar una configuración específica para algún ambiente, se puede aplicar a través del archivo deploymentPatch.yaml ubicado en la carpeta del ambiente deseado (dev/test/qa/prod).