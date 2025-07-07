#!/bin/bash

# Fix Card component imports in student-ui
cd "/Users/venkatnarla/Desktop/personal/Nero_Skill_Trainer/clients/student-ui"

# Find all .tsx files that use Card components and update their imports
find src -name "*.tsx" -exec grep -l "CardContent\|CardHeader\|CardTitle\|CardDescription\|CardFooter" {} \; | while read file; do
    # Skip the Card component definition file itself
    if [[ "$file" == *"/ui/Card.tsx" ]]; then
        continue
    fi
    
    # Check if file has Card import but not specific Card component imports
    if grep -q "import.*Card.*from.*Card" "$file" && ! grep -q "CardContent\|CardHeader\|CardTitle\|CardDescription" "$file" | head -1; then
        # Replace Card import with specific component imports
        sed -i '' 's/import { Card } from/import { Card, CardHeader, CardContent, CardTitle, CardDescription } from/g' "$file"
        sed -i '' 's/import Card from/import { Card, CardHeader, CardContent, CardTitle, CardDescription } from/g' "$file"
        echo "Updated imports in $file"
    fi
done

echo "Card component imports updated!"
