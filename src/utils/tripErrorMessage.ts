import type { ServiceError } from '@/types/trip';

export const getTripShareErrorMessage = (error: ServiceError | null): string => {
  if (!error) return '서버 오류가 발생했습니다.';

  switch (error.code) {
    case 'INVALID_INPUT':
      return '잘못된 요청입니다.';
    case 'USER_NOT_FOUND':
      return '사용자를 찾을 수 없습니다.';
    case 'INTERNAL_ERROR':
      return '서버 오류가 발생했습니다.';
    default:
      return '서버 오류가 발생했습니다.';
  }
};

export const getTripDeleteErrorToastMessage = (error: ServiceError | null): string => {
  if (!error) return '여행 삭제에 실패하였습니다';

  switch (error.code) {
    case 'AUTH_TOKEN_MISSING':
      return '로그인이 필요합니다.';
    case 'HTTP_401':
      return '인증이 만료되었습니다. 다시 로그인해주세요.';
    case 'HTTP_403':
      return '삭제 권한이 없습니다.';
    case 'INVALID_INPUT':
      return '잘못된 요청입니다.';
    case 'USER_NOT_FOUND':
      return '사용자를 찾을 수 없습니다.';
    case 'REQUEST_ABORTED':
      return '요청이 취소되었습니다.';
    default:
      return '여행 삭제에 실패하였습니다';
  }
};

export const getTripScheduleDeleteErrorToastMessage = (error: ServiceError | null): string => {
  if (!error) return '일정 삭제에 실패하였습니다';

  switch (error.code) {
    case 'AUTH_TOKEN_MISSING':
      return '로그인이 필요합니다.';
    case 'HTTP_401':
      return '인증이 만료되었습니다. 다시 로그인해주세요.';
    case 'HTTP_403':
      return '삭제 권한이 없습니다.';
    case 'INVALID_INPUT':
      return '잘못된 요청입니다.';
    case 'REQUEST_ABORTED':
      return '요청이 취소되었습니다.';
    default:
      return '일정 삭제에 실패하였습니다';
  }
};

export const getCreateTripErrorMessage = (): string => '여행 생성에 실패했습니다.';

export const getServiceErrorMessage = (error: ServiceError | null): string => {
  if (!error) return '서버 오류가 발생했습니다.';
  return error.message?.trim() || error.code || '서버 오류가 발생했습니다.';
};

export const getTripRouteErrorToastMessage = (): string => '길찾기 요청에 실패하였습니다';

export const getTripTitleUpdateErrorToastMessage = (error: ServiceError | null): string => {
  if (!error) return '제목 수정에 실패하였습니다';

  switch (error.code) {
    case 'AUTH_TOKEN_MISSING':
      return '로그인이 필요합니다.';
    case 'HTTP_401':
      return '인증이 만료되었습니다. 다시 로그인해주세요.';
    case 'HTTP_403':
      return '수정 권한이 없습니다.';
    case 'INVALID_INPUT':
      return '잘못된 요청입니다.';
    case 'REQUEST_ABORTED':
      return '요청이 취소되었습니다.';
    default:
      return '제목 수정에 실패하였습니다';
  }
};
