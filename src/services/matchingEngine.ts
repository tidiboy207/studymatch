import { UserProfile, MatchCandidate, MatchingWeights, MatchScoreDetails } from '../types';
import { getSlotLabel } from '../data/subjectsCatalog';

export const DEFAULT_WEIGHTS: MatchingWeights = {
  c: 0.35,
  t: 0.30,
  g: 0.20,
  l: 0.15
};

export function calculateMatchScore(
  userA: UserProfile,
  userB: UserProfile,
  weights: MatchingWeights = DEFAULT_WEIGHTS
): MatchScoreDetails {
  // 1. Tiêu chí C: Môn học & Bù trừ kiến thức (0-100)
  let cScore = 0;
  const complementaryTopics: string[] = [];
  
  // Kiểm tra trùng môn qua priority_subject hoặc qua subjects_detail
  const userASubjectCodes = userA.subjects_detail?.map(s => s.code || s.subject_id) || [];
  const userBSubjectCodes = userB.subjects_detail?.map(s => s.code || s.subject_id) || [];
  const sharedCodes = userASubjectCodes.filter(c => userBSubjectCodes.includes(c));
  
  const sameSubject = userA.priority_subject === userB.priority_subject || sharedCodes.length > 0;
  let matchedSubjectName = userA.priority_subject;

  if (sameSubject) {
    cScore = 50; // Điểm cơ sở khi cùng môn
    let hasBonus = false;

    // (a) Hai người bù trừ trực tiếp: Yếu của A nằm trong Mạnh của B hoặc ngược lại
    let aWeakInBStrong = userA.weak_topics.filter(t => userB.strong_topics.includes(t));
    let bWeakInAStrong = userB.weak_topics.filter(t => userA.strong_topics.includes(t));

    // Kiểm tra thêm từ subjects_detail nếu có môn chung
    if (sharedCodes.length > 0) {
      const code = sharedCodes[0];
      const sA = userA.subjects_detail?.find(s => (s.code || s.subject_id) === code);
      const sB = userB.subjects_detail?.find(s => (s.code || s.subject_id) === code);
      if (sA && sB) {
        matchedSubjectName = sA.fullName;
        const subAWeakInBStrong = sA.weak_topics.filter(t => sB.strong_topics.includes(t));
        const subBWeakInAStrong = sB.weak_topics.filter(t => sA.strong_topics.includes(t));
        aWeakInBStrong = [...new Set([...aWeakInBStrong, ...subAWeakInBStrong])];
        bWeakInAStrong = [...new Set([...bWeakInAStrong, ...subBWeakInAStrong])];
      }
    }

    if (aWeakInBStrong.length > 0 || bWeakInAStrong.length > 0) {
      hasBonus = true;
      complementaryTopics.push(...aWeakInBStrong, ...bWeakInAStrong);
    }

    // (b) 1 người có chủ đề yếu và đối phương là Khá muốn ôn sâu (self_level = 3)
    if (!hasBonus && (
      (userA.weak_topics.length > 0 && userB.self_level === 3) ||
      (userB.weak_topics.length > 0 && userA.self_level === 3)
    )) {
      hasBonus = true;
    }

    // (c) Có chung ít nhất 1 chủ đề yếu cùng muốn giải bài tập
    const sharedWeak = userA.weak_topics.filter(t => userB.weak_topics.includes(t));
    if (!hasBonus && sharedWeak.length > 0) {
      hasBonus = true;
      complementaryTopics.push(...sharedWeak);
    }

    if (hasBonus) {
      cScore = 100;
    }
  }

  // 2. Tiêu chí T: Lịch rảnh trùng nhau (0-100)
  const matchedSlots = userA.free_slots.filter(s => userB.free_slots.includes(s));
  let tScore = 0;
  if (matchedSlots.length >= 2) {
    tScore = 100;
  } else if (matchedSlots.length === 1) {
    tScore = 50;
  } else {
    tScore = 0;
  }

  // 3. Tiêu chí G: Mục tiêu học tập (0-100)
  const gScore = userA.learning_goal === userB.learning_goal ? 100 : 50;

  // 4. Tiêu chí L: Phong cách học (0-100)
  const lScore = userA.learning_style === userB.learning_style ? 100 : 40;

  // Chuẩn hóa trọng số nếu tổng khác 1
  const weightSum = weights.c + weights.t + weights.g + weights.l || 1;
  const wc = weights.c / weightSum;
  const wt = weights.t / weightSum;
  const wg = weights.g / weightSum;
  const wl = weights.l / weightSum;

  const totalScore = Math.round(wc * cScore + wt * tScore + wg * gScore + wl * lScore);

  // Sinh lý do ghép tường minh (Match Reason)
  const reasonParts: string[] = [];
  reasonParts.push(`Độ hợp ${totalScore}%`);

  if (sameSubject) {
    const subjectShort = userA.priority_subject.split(' - ')[1] || userA.priority_subject;
    if (complementaryTopics.length > 0) {
      reasonParts.push(`Bù trừ sâu phần ${complementaryTopics[0]}`);
    } else {
      reasonParts.push(`Cùng ôn ${subjectShort}`);
    }
  } else {
    reasonParts.push('Khác môn ưu tiên');
  }

  if (matchedSlots.length > 0) {
    const slotNames = matchedSlots.slice(0, 2).map(getSlotLabel).join(', ');
    reasonParts.push(`Trùng ${matchedSlots.length} ca rảnh (${slotNames})`);
  } else {
    reasonParts.push('Chưa trùng ca rảnh cố định');
  }

  if (userA.learning_goal === userB.learning_goal) {
    reasonParts.push(`Cùng mục tiêu: ${userA.learning_goal}`);
  }

  const reason = reasonParts.join(' • ');

  return {
    totalScore,
    cScore,
    tScore,
    gScore,
    lScore,
    reason,
    matchedSlots,
    complementaryTopics: Array.from(new Set(complementaryTopics))
  };
}

export function rankMatchingCandidates(
  currentUser: UserProfile,
  allProfiles: UserProfile[],
  blockedUserIds: string[] = [],
  weights: MatchingWeights = DEFAULT_WEIGHTS
): MatchCandidate[] {
  return allProfiles
    .filter(p => p.id !== currentUser.id && !blockedUserIds.includes(p.id))
    .map(profile => ({
      profile,
      scoreDetails: calculateMatchScore(currentUser, profile, weights)
    }))
    .sort((a, b) => b.scoreDetails.totalScore - a.scoreDetails.totalScore);
}
