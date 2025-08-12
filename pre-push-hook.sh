#!/bin/sh

# 현재 브랜치 확인
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

echo "🔍 현재 브랜치: $current_branch"

# 명령어에서 main 브랜치로 푸시하려는지 확인
if echo "$@" | grep -q "main"; then
    echo ""
    echo "❌ ERROR: main 브랜치에 직접 푸시할 수 없습니다!"
    echo "💡 해결 방법:"
    echo "   1. Pull Request를 생성하세요"
    echo "   2. 또는 현재 브랜치로 푸시하세요: git push origin $current_branch"
    echo "   3. 강제로 푸시하려면: git push origin main --force (권장하지 않음)"
    echo ""
    exit 1
fi

echo "✅ 푸시가 허용됩니다."
exit 0
