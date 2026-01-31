#!/bin/bash
# Creates simple green circle placeholder icons for the extension

# 16x16 icon (minimal green square)
echo "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWklEQVQ4T2NkwA7+M2ABjFgVMKIbQFQAxhoQpQGoDUhiYBCQDIhqA1IYUMRJCgQwDOBnwDTg/38gTjYDiNEAMZi4QCBaAyYDiNeAnBEkBQJuAwYuDIgOZFKCHwBUPxQR5wPcUgAAAABJRU5ErkJggg==" | base64 -d > icon16.png

# 32x32 icon  
echo "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAgklEQVRYR+2WwQ3AIAwDk+5/aTapVKE4IfCp+hkh7HMMS0b+LJnrNwBqAy4DmI8BA8i+Bk4GXN3AAGZ+DVhm9gYcfQ1YZvYGDGB2D3CDWX4LWGZ2AlhmdgJYZnYCWGZ2AlhmdgJYZnYCDGD2CLDMDAJYZnYCWGZ2AlhmdgJYZnYC3PkLfuhAIS9jJIgAAAAASUVORK5CYII=" | base64 -d > icon32.png

# Create 48x48 and 128x128 as copies (will work for testing)
cp icon32.png icon48.png
cp icon32.png icon128.png

echo "Icons created!"
ls -la
