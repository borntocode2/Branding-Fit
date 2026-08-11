const test = require('node:test');
const assert = require('node:assert/strict');

const {
    portfolioItems,
    mapHomeIndustryToWorkspace,
    validateDesignRequest
} = require('../src/shared/specData');

test('portfolio data contains the required launch panels', () => {
    const ids = portfolioItems.map(item => item.id);

    assert.deepEqual(ids.slice(0, 4), ['homeypaw', 'neulbom', 'voyagemate', 'view-more']);
    assert.equal(portfolioItems[0].brandName, 'HomeyPaw');
    assert.equal(portfolioItems[1].brandName, '늘봄');
    assert.equal(portfolioItems[2].brandName, 'VoyageMate');
});

test('home industry draft maps into unified portfolio category values', () => {
    assert.equal(mapHomeIndustryToWorkspace('카페•식당'), '카페•식당');
    assert.equal(mapHomeIndustryToWorkspace('패션•뷰티'), '패션•뷰티');
    assert.equal(mapHomeIndustryToWorkspace('플랫폼•어플'), '플랫폼•어플');
    assert.equal(mapHomeIndustryToWorkspace('알 수 없는 업종'), '기타');
});

test('design request validation returns field-level errors', () => {
    const result = validateDesignRequest({
        name: '',
        email: 'not-an-email',
        content: '',
        privacyAgreed: false
    });

    assert.equal(result.valid, false);
    assert.equal(result.errors.name, '필수 입력 항목입니다.');
    assert.equal(result.errors.email, '올바른 이메일을 입력해 주세요.');
    assert.equal(result.errors.content, '필수 입력 항목입니다.');
    assert.equal(result.errors.privacyAgreed, '동의가 필요합니다.');
});

test('design request validation accepts a complete public request', () => {
    const result = validateDesignRequest({
        name: '홍길동',
        email: 'hello@example.com',
        content: '로고 고도화와 패키지 디자인을 의뢰하고 싶습니다.',
        privacyAgreed: true
    });

    assert.deepEqual(result, { valid: true, errors: {} });
});
